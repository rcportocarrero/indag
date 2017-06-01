<?php

namespace Seleccion;

use Zend\Authentication\AuthenticationService;
use Zend\ModuleManager\ModuleManager;

class Module {

    public function getAutoloaderConfig() {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php'
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getServiceConfig() {
        return array(
            'factories' => array(
                'Seleccion\Model\SpTable' => function($sm) {
                    $dbAdapter = $sm->get('db_maestro');
                    $table = new \Seleccion\Model\SpTable($dbAdapter);
                    return $table;
                },
                'Seleccion\Model\SeleccionTable' => function($sm) {
                    $dbAdapter = $sm->get('db_maestro');
                    $table = new \Seleccion\Model\SeleccionTable($dbAdapter);
                    return $table;
                },
                'Seleccion\Validator\SeleccionValidator' => function() {
                    $table = new \Seleccion\Validator\SeleccionValidator();
                    return $table;
                },
            ),
        );
    }

    public function init(ModuleManager $manager) {
        $events = $manager->getEventManager();
        $sharedEvents = $events->getSharedManager();
        $sharedEvents->attach(__NAMESPACE__, 'dispatch', function($e) {
            $controller = $e->getTarget();
            if (get_class($controller) == 'Seleccion\Controller\IndexController') {
                $controller->layout('layout/layout_seleccion');
            }
        }, 100);
    }

}
