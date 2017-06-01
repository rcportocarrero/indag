<?php

return array(
    'controllers' => array(
        'invokables' => array(
            'Dashboard\Controller\Index' => 'Dashboard\Controller\IndexController'
        )
    ),
    'router' => array(
        'routes' => array(
//            'usuario' => array(
//                'type' => 'segment',
//                'options' => array(
//                    'route' => '/usuario[/:action][/:id]',
//                    'constraints' => array(
//                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
//                        'id' => '[0-9]+'
//                    ),
//                    'defaults' => array(
//                        'controller' => 'Usuario\Controller\Usuario',
//                        'action' => 'index'
//                    )
//                )
//            )

            'dashboard' => array(
                'type' => 'Literal',
                'options' => array(
                    'route' => '/dashboard',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Dashboard\Controller',
                        'controller' => 'Dashboard\Controller\Index',
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
             __DIR__ . '/../view'
        ),
    ),
//    'module_layouts' => array(
//        'admin' => 'layout/layout_admin.phtml'
//    ),
);
