FROM php:8.2-apache

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache mod_rewrite module for route handling (.htaccess)
RUN a2enmod rewrite

# Set Apache Document Root to /var/www/html
WORKDIR /var/www/html

# Copy application files
COPY . .

# Ensure uploads & logs directories exist with correct permissions
RUN mkdir -p uploads logs \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 uploads logs

EXPOSE 80

CMD ["apache2-foreground"]
