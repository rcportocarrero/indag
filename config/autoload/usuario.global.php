<?php

return [
    'usuario' => [
        'path_files' => [
            'pdf'                   => getcwd() . '/public/pdf', // enlace simbólico    
            'date_format'           => 'YmdHis',
        ],     
        'num_caracteres'    => [
            'captcha' => [
                    'enabled'       =>  true,
                    'diccionario'   =>  'ABX',             //Letras permitidas en el captcha 'ABCDEFGHIJKLMNPQRSTUVWXYZ',
                    'tamano_codigo' =>  3                //Número de caracteres permitidos para el captcha
            ]         
        ]
    ],

   
];
