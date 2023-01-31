#!/bin/bash
if [ ! -z "$SERVER_ENV" ] && [ ! -z "$SERVER_APP_NAME" ];
        then
                mkdir /opt/$SERVER_APP_NAME/backup
                cd /opt/$SERVER_APP_NAME/frontend/app
                zip -r /opt/$SERVER_APP_NAME/backup/frontend_app *
                #rm -rf /var/www/html/app/*
                rm -rf /opt/$SERVER_APP_NAME/frontend/app/*

                aws s3 cp /opt/$SERVER_APP_NAME/backup/frontend_app*.zip s3://sbm-backup-applications/$SERVER_APP_NAME/$SERVER_ENV/
                rm -rf /opt/$SERVER_APP_NAME/backup/frontend_app*.zip
        else
                ls -l /VariavelNaoExiste
fi
