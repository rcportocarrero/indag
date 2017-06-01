<?php

return [
    'db' => array(
        'adapters' => array(
            'db_maestro' => array(
                'charset' => 'utf8',
                'database' => 'cpm_trayectoria',
                'driver' => 'PDO_Mysql',
                'hostname' => '11.35.100.29',
                'username' => 'invitada_qa',
                'password' => 'machete123',
                'port' => '3306',
                'profiler' => true, 
            ),
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Db\Adapter\AdapterAbstractServiceFactory',
        )
    ),
];