<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Token\TokenDecoder;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class DatabaseController extends AbstractController
{
    private $dbServer;
    private $dbPassword;
    private $dbAdmin;

    public function __construct()
    {
        $this->dbServer = $_ENV['MARIADB_MAIN_SERVER'];
        $this->dbPassword = $_ENV['MARIADB_MAIN_PASSWORD'];
        $this->dbAdmin = $_ENV['MARIADB_MAIN_ADMIN'];
    }

    #[Route('/db/new', name: 'new_db')]
    public function postDatabases(Request $request): JsonResponse
    {
        $request_params = json_decode($request->getContent(), true);
        if(!$request_params) return new JsonResponse(['status' => 'error', 'error' => 'Invalid request'], 400);

        $token_decoder = new TokenDecoder('secret');
        $token = $token_decoder->token_verify($request_params['token']);
        if ($token === false) return new JsonResponse(['status' => 'error', 'error' => 'Unauthorized'], 401);

        $mysqli = new \mysqli($this->dbServer, $this->dbAdmin, $this->dbPassword);

        if ($mysqli->connect_error) {
            return new JsonResponse(['status' => 'error', 'error' => 'Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error]);
        }

        if (!$mysqli->ping()) {
            $mysqli = new \mysqli($this->dbServer, $this->dbAdmin, $this->dbPassword);
            if ($mysqli->connect_error) {
                return new JsonResponse(['status' => 'error', 'error' => 'Reconnection Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error]);
            }
        }

        $dbName = $mysqli->real_escape_string($request_params['dbName']);
        $result = $mysqli->query('CREATE DATABASE IF NOT EXISTS ' . $dbName);

        if (!$result) {
            $mysqli->close();
            return new JsonResponse(['status' => 'error', 'error' => $mysqli->error]);
        }

        $mysqli->close();

        return new JsonResponse(['status' => 'ok', 'data' => $result]);
    }

    #[Route('/database/{dbName}/recap', name: 'database_recap', methods: ['GET'])]
    public function getDatabaseRecap(string $dbName, Request $request): JsonResponse
    {
        $token_decoder = new TokenDecoder('secret');
        $token = $request->headers->get('token');
        $decoded_token = $token_decoder->token_verify($token);
        if ($decoded_token == false) return new JsonResponse(['error' => 'Unauthorized'], 401);

        $mysqli = new \mysqli($this->dbServer, $this->dbAdmin, $this->dbPassword);

        if ($mysqli->connect_error) {
            return new JsonResponse(['status' => 'error', 'error' => 'Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error]);
        }

        $mysqli->select_db($dbName);

        // Get list of tables
        $tablesResult = $mysqli->query('SHOW TABLES');
        $tableNames = [];
        while ($row = $tablesResult->fetch_array(MYSQLI_NUM)) {
            $tableNames[] = $row[0];
        }

        $stats = [];
        $totalDataSize = 0;

        foreach ($tableNames as $tableName) {
            $tableStats = $this->getTableStats($mysqli, $tableName);
            $stats[] = [
                'name' => $tableName,
                'rowCount' => $tableStats['row_count'],
                'dataSize' => $tableStats['data_length']
            ];
            $totalDataSize += $tableStats['data_length'];
        }

        $mysqli->close();

        return new JsonResponse([
            'tables' => $stats,
            'total' => [
                'dataSize' => $totalDataSize
            ]
        ]);
    }

    private function getTableStats(\mysqli $mysqli, string $tableName): array
    {
        // Get row count
        $rowCountResult = $mysqli->query("SELECT COUNT(*) AS row_count FROM " . $mysqli->real_escape_string($tableName));
        $rowCount = $rowCountResult->fetch_assoc()['row_count'] ?? 0;

        // Get table size (data_length in bytes)
        $statsResult = $mysqli->query("
            SELECT 
                table_rows AS row_count, 
                data_length AS data_length
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
            AND table_name = '" . $mysqli->real_escape_string($tableName) . "'
        ");
        $stats = $statsResult->fetch_assoc();
        $dataLength = $stats['data_length'] ?? 0;

        return [
            'row_count' => $rowCount,
            'data_length' => $dataLength,
        ];
    }

    #[Route('/database/dump', name: 'database_dump', methods: ['POST'])]
    public function dumpDatabase(Request $request): JsonResponse
{
    // Décodage et vérification du token
    $token_decoder = new TokenDecoder('secret');
    $token = $request->headers->get('token');
    $decoded_token = $token_decoder->token_verify($token);
    if ($decoded_token == false) return new JsonResponse(['error' => 'Unauthorized'], 401);

    $request_params = json_decode($request->getContent(), true);

    // Commande mysqldump avec chaque argument séparé dans un tableau
    $process = new Process([
        'mysqldump', 
        '--user=' . $_ENV['MARIADB_ADMIN'], 
        '--password=' . $_ENV['MARIADB_PASSWORD'], 
        '--no-data', 
        $request_params['dbName']
    ]);

    $process->setTimeout(3600);

    // Exécuter le processus
    try {
        $process->mustRun();
    } catch (ProcessFailedException $e) {
        return new JsonResponse(['status' => 'error', 'error' => 'Failed to generate dump: ' . $e->getMessage()], 500);
    }

    // Récupérer la sortie de mysqldump
    $dumpData = $process->getOutput();

    // Retourner les données encodées en base64 pour transport sécurisé
    return new JsonResponse([
        'status' => 'ok',
        'data' => base64_encode($dumpData),
    ]);
}
}




    // #[Route('/db', name: 'get_db')]
    // public function getDatabases(EntityManagerInterface $entityManager, Request $request): JsonResponse
    // {
    //     $token_decoder = new TokenDecoder('secret');
    //     $token = $request->headers->get('token');
    //     $decoded_token = $token_decoder->token_verify($token);
    //     if ($decoded_token == false) return new JsonResponse(['error' => 'Unauthorized'], 401);

    //     $request_params = json_decode($request->getContent(), true);

    //     // $userDb = $entityManager->getRepository(DatabaseInfo::class)->findOneBy(['name' => $request_params['dbName']]);

    // }
        // $token_decoder = new TokenDecoder('secret');
        // $token = $token_decoder->token_verify($request->headers->get('token'));
        // if ($token == false) {
        //     return new JsonResponse(['error' => 'Unauthorized'], 401);
        // } else {
        //     $dbPassword = $_ENV['MARIADB_PASSWORD'];
        //     $dbAdmin = $_ENV['MARIADB_ADMIN'];
        //     $mysqli = new \mysqli('127.0.0.1', $dbAdmin, $dbPassword);
        //     $forbidden = ['information_schema', 'performance_schema', 'mysql', 'sys', 'phpmyadmin', 'plateforme-safebase-auth'];

        //     if ($mysqli->connect_error) {
        //         die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
        //     }

        //     $result = $mysqli->query('SHOW DATABASES');

        //     if (!$result) {
        //         die('Error: ' . $mysqli->error);
        //     }

        //     $databases = [];
        //     while ($row = $result->fetch_assoc()) {
        //         if (!in_array($row['Database'], $forbidden)) $databases[] = $row['Database'];
        //     }

        //     $mysqli->close();

        //     return new JsonResponse(['output' => $databases]);
        // }
