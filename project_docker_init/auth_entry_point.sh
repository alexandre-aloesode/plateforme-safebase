#!/bin/bash

# Attendre que la base de données soit prête
# until nc -z -v -w30 auth_db 3306
# do
#   echo "Waiting for database connection..."
#   sleep 5
# done

# Exécuter les migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Démarrer le serveur Symfony
symfony server:start --no-tls --port=8000