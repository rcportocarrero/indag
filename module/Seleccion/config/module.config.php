<?php

return array(
    'controllers' => array(
        'invokables' => array(
            'Seleccion\Controller\Index' => 'Seleccion\Controller\IndexController',
        )
    ),
    'router' => array(
        'routes' => array(
            'seleccion' => array(
                'type' => 'Literal',
                'options' => array(
                    'route' => '/seleccion',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Seleccion\Controller',
                        'controller' => 'Seleccion\Controller\Index',
                        'action' => 'index',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/[:controller[/:action]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ),
                            'defaults' => array(
                            ),
                        ),
                    ),
                ),
            ),
        )
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            'seleccion' => __DIR__ . '/../view'
        ),
        'template_map' => array(
            'layout/layout_seleccion' => __DIR__ . '/../view/layout/layout.phtml',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
    'asset_manager' => array(
        'resolver_configs' => array(
            'map' => array(
                'string.js' => __DIR__ . '/../public/js/string.js',
                'menu_form.js' => __DIR__ . '/../public/js/menu_form.js',
            ),
            'collections' => array(
                'd.js' => array(
                    'string.js',                    
                    'menu_form.js',
                ),
            ),
        ),
        'filters' => array(
            'd.js' => array(
                array(
                    // Note: You will need to require the classes used for the filters yourself.
                    'filter' => 'JSMin', // Allowed format is Filtername[Filter]. Can also be FQCN
                ),
            ),
        ),
        'caching' => array(
            'style.css' => array(
                'cache' => 'Assetic\\Cache\\FilesystemCache',
                'options' => array(
                    'dir' => __DIR__ . '/../../../data/cache', // path/to/cache
                ),
            ),
            'd.js' => array(
                'cache' => 'Assetic\\Cache\\FilesystemCache',
                'options' => array(
                    'dir' => __DIR__ . '/../../../data/cache', // path/to/cache
                ),
            ),
        ),
    ),
);
