<?php

return [
    'apigility' => [
        'config' => [
//            'url' => 'http://167.114.170.28:7000/web/',
            'url' => 'http://167.114.170.28:7500/web/',
            'url_login' => 'http://167.114.170.28:7500/',
            'user' => 'invitado',
            'pass' => '12345678',
        ],
    ],
    'module_layouts' => [
        'Application' => 'layout/layout.phtml',
        'Usuario' => 'layout/layout_usuario.phtml',
        'Dashboard' => 'layout/layout_admin.phtml'
    ],
    'view_manager' => [
        'strategies' => [
            'ViewJsonStrategy',
        ]
    ]
];
