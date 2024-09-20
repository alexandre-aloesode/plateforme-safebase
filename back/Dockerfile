FROM php:8.2-fpm

# Installer les extensions nécessaires pour Symfony et MariaDB
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libpq-dev libzip-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip

# Installer Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Créer un utilisateur non-root
RUN useradd -ms /bin/bash symfonyuser

# Définir le répertoire de travail
WORKDIR /var/www

# Copier les fichiers et changer les permissions
COPY --chown=symfonyuser:symfonyuser . .

# Passer à l'utilisateur non-root
USER symfonyuser

# Installer Composer dans un répertoire accessible
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/var/www/bin --filename=composer

# Assurer que le fichier console est exécutable
RUN chmod +x /var/www/bin/console

# Installer les dépendances avec Composer
RUN /var/www/bin/composer install --no-interaction

# Exposer le port utilisé par Symfony server
EXPOSE 8000

# Démarrer le serveur Symfony
CMD ["symfony", "server:start", "--no-tls", "--port=8000"]
