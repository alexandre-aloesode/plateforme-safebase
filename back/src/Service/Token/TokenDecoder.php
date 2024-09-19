<?php

namespace App\Service\Token;

use ContainerIxWPDVe\getMessenger_Retry_MultiplierRetryStrategy_AsyncService;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenDecoder
{
    public function __construct(
        private readonly string $jwtSecret,
    ) {
    }

    public function decode(string $token): array
    {
        $credentials = (array)JWT::decode(trim($token, '"'), new Key($this->jwtSecret, 'HS256'));
        return $credentials;
    }

    public function token_verify(string $token = null): bool|array
    {
        if ($token == null) {
            return false;
        } else {
            $token = $this->decode($token);
            if (!$token) {
                return false;
            } else return $token;
        }
    }
}
