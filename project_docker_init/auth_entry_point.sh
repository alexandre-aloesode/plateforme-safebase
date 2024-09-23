#!/bin/bash

# Attendre que la base de données soit prête
until nc -z -v -w30 auth_db 3306
do
  echo "Waiting for database connection..."
  sleep 5
done

# Exécuter les migrations
php bin/console doctrine:migrations:migrate --no-interaction

php bin/console app:create-users --no-interaction

# Vérifier si le fichier SQL existe
if [ -f /var/www/sql/init_fake_users.sql ]; then
  echo "Executing SQL script..."
  mysql -h auth_db -P 3306 -u authUser -pauthPassword auth_db < /var/www/sql/init_fake_users.sql
#   mysql -u authUser -p authPassword -h auth_db -P 3306 auth_db < /var/www/sql/init_fake_users.sql
else
  echo "SQL script not found!"
fi

# Démarrer le serveur Symfony
symfony server:start --no-tls --port=8000