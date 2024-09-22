#!/bin/bash

# Attendre que la base de données principale soit disponible
# until nc -z -v -w30 main_db 3306
# do
#   echo "Waiting for main_db database connection..."
#   sleep 5
# done

# # Attendre que la base de données de backup soit disponible
# # until nc -z -v -w30 backup_db 3306
# # do
# #   echo "Waiting for backup_db database connection..."
# #   sleep 5
# # done

# # Exécuter les migrations
# php /var/www/bin/console doctrine:migrations:migrate --no-interaction

# Lancer le serveur Symfony
symfony server:start --no-tls --port=8003
