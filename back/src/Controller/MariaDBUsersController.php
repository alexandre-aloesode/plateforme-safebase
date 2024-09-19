<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Process\Process;

//https://symfony.com/doc/current/service_container/request.html
class MariaDBUsersController extends AbstractController
{
    #[Route('/user/new', name: 'new_mariadb_user')]
    public function postUser(Request $request): JsonResponse
    {
        $request_params = json_decode($request->getContent(), true);
        // return new JsonResponse(["tamere" => $request_params['username'], "tamere2" => $request_params['password'], "status" => "ok"], 201);   
        $dbPassword = $_ENV['MARIADB_PASSWORD'];
        $dbAdmin = $_ENV['MARIADB_ADMIN'];
        // $process = new Process(['mariadb', '-u', $dbAdmin, '-e']);
        // $process = new Process(['mariadb', '-u', $dbAdmin, '-e', 'CREATE USER ' . $request_params['username'] . '@localhost IDENTIFIED BY ' . $request_params['password']]);
        // $process->setEnv(['MYSQL_PWD' => $dbPassword]);
        // $process->run();
        // if (!$process->isSuccessful()) {
        //     return new JsonResponse(['status' => 'notok', 'res' => $process], 500);
        // }
        // return new JsonResponse(['status' => 'ok', 'res' => $process], 201);

        $mysqli = new \mysqli('127.0.0.1', $dbAdmin, $dbPassword);
        
        if ($mysqli->connect_error) {
                return new JsonResponse(['status' => 'error', 'error' => 'Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error], 500);
            }
            
            $result = $mysqli->query('CREATE USER "' . $request_params['username'] . '"@"localhost" IDENTIFIED BY "' . $request_params['password'] . '"');
            
            if (!$result) {
                    return new JsonResponse(['status' => 'error', 'error' => 'Error: ' . $mysqli->error], 500);
                }
                
                return new JsonResponse(['status' => 'ok', 'res' => $result], 201);
    }
}
