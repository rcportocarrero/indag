<?php

namespace Usuario\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use BaseX\Apigility\AgAdapter;
use Zend\Session\Container;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\SmtpOptions;
use Zend\Mail\Message;
use Zend\Mime\Message as MimeMessage;
use Zend\Mime\Part as MimePart;
use Zend\Crypt\Password\Bcrypt;
use Zend\View\Model\JsonModel;
use BaseX\Util\Util;
use Zend\Validator\ValidatorChain;
use Zend\Validator\StringLength;
use Zend\I18n\Validator\Alnum;
use Zend\Validator\Regex;
use Zend\Validator\Date;

class SecController extends \BaseX\Controller\BaseController {

    protected $_need_auth = false;
    protected $container;
    protected $_oauth_temp_table = null;
    protected $_nexus_table = null;

    public function __construct()
    {
        $this->container = new Container('sesion');
    }

//    public function getOauthTempTable() {
//        if (!$this->_oauth_temp_table) {
//            $sm = $this->getServiceLocator();
//            $this->_oauth_temp_table = $sm->get('Usuario\Model\OauthTempTable');
//        }
//        return $this->_oauth_temp_table;
//    }

    public function indexAction()
    {
        $app_config = $this->getConfig('app');
        $usuario_config = $this->getConfig('usuario');
        $this->layout()->apps_var = $app_config;
        $this->layout()->apps_config_caracteres = $usuario_config['num_caracteres'];

        $params_view = [
            'apps_var' => $app_config,
            'apps_usuario' => $usuario_config,
            'msg' => $this->flashMessenger()->getMessages(),
        ];
        if ($this->getSessionStorage()->isAuthenticate())
        {
            return $this->redirect()->toRoute('dashboard');
        }
        $view = new ViewModel($params_view);
        return $view;
    }
    
    public function changePasswordAction()
    {
        $request = $this->getRequest();
        if ($request->isPost())
        {
            $pass_current = $request->getPost('pass_current', '');
            $pass_new = $request->getPost('pass_new', '');
            $pass_confirmation = $request->getPost('pass_confirmation', '');
            $error = [];

            $params = [
                'currentPassword' => $pass_current,
                'newPassword' => $pass_new,
            ];
            $username = $this->getSessionStorage()->get('user');
            $password = $this->getSessionStorage()->get('pass');

            $result_ = $this->curl_2('user/changepassword', json_encode($params), ['user' => $username, 'pass' => $password]);
            if (intval($result_['code']) === 200)
            {
                $rpta_json = json_decode($result_['data'], true);
                if ($rpta_json['success'])
                {
                    $this->getSessionStorage()->add('pass', $pass_new);
                    $this->getSessionStorage()->save();
                    $respuesta = [
                        'id' => 200,
                        'msg' => $rpta_json['message'],
                    ];
                }
                else
                {
                    $respuesta = [
                        'id' => -100,
                        'msg' => $rpta_json['message'],
                    ];
                }
            }
            else
            {
                $respuesta = [
                    'id' => -100,
                    'msg' => 'Por favor vuelva a intentarlo en unos segundos.',
                ];
            }

            return new JsonModel($respuesta);
        }
        else
        {
            $respuesta = [
                'id' => -100,
                'msg' => 'M�todo aceptado POST.',
            ];
            return new JsonModel($respuesta);
        }
    }

    public function validateAction()
    {

        $request = $this->getRequest();
        if ($request->isPost())
        {
            $documento = $request->getPost('usuario_sec_documento', '');
            $clave = strtoupper($request->getPost('usuario_sec_password', ''));
            $captcha = strtoupper($request->getPost('usuario_sec_captcha_login', ''));
            $config = $this->getConfig();
            $captcha_enabled = $config['usuario']['num_caracteres']['captcha']['enabled'];
            $captcha_tamanio = $config['usuario']['num_caracteres']['captcha']['tamano_codigo'];
            if ($captcha_enabled)
            {
                if (strlen($captcha) !== intval($captcha_tamanio) || $captcha !== $this->container->login_captcha)
                {
                    $this->flashMessenger()->clearMessages();
                    $this->flashmessenger()->addMessage('<div class = "alert alert-danger alert-dismissable"><i class = "fa fa-ban"></i><button type = "button" class = "close" data-dismiss = "alert" aria-hidden = "true">x</button><b>Alerta!</b> El código de la imagen ingresado es incorrecto.</div>');
                    return $this->redirect()->toRoute('usuario/sec');
                }
            }

            if ($documento === '')
            {
                $this->flashMessenger()->clearMessages();
                $this->flashmessenger()->addMessage('<div class = "alert alert-danger alert-dismissable"><i class = "fa fa-ban"></i><button type = "button" class = "close" data-dismiss = "alert" aria-hidden = "true">x</button><b>Alerta!</b> Debe de ingresar su usuario.</div>');
                return $this->redirect()->toRoute('usuario/sec');
            }


//            $cmin_dni = (int) $config['usuario']['num_caracteres']['documento_identidad']['min'];
//            if (strlen($documento) < $cmin_dni)
//            {
//                $this->flashMessenger()->clearMessages();
//                $this->flashmessenger()->addMessage('<div class = "alert alert-danger alert-dismissable"><i class = "fa fa-ban"></i><button type = "button" class = "close" data-dismiss = "alert" aria-hidden = "true">x</button><b>Alerta!</b> El número de documento debe tener ' . $cmin_dni . ' digitos como mínimo.</div>');
//                return $this->redirect()->toRoute('usuario/sec');
//            }

            if ($clave === '')
            {
                $this->flashMessenger()->clearMessages();
                $this->flashmessenger()->addMessage('<div class = "alert alert-danger alert-dismissable"><i class = "fa fa-ban"></i><button type = "button" class = "close" data-dismiss = "alert" aria-hidden = "true">x</button><b>Alerta!</b> Debe de ingresar la contraseña.</div>');
                return $this->redirect()->toRoute('usuario/sec');
            }

            $params = [
                'user' => $documento,
                'pass' => $clave
            ];

            $result_ = $this->curl_login('loginsuccess', $params);
            if (intval($result_['code']) === 200)
            {
                $json_datos = json_decode($result_['data'], true);
                $this->getSessionStorage()->add('user', $documento);
                $this->getSessionStorage()->add('pass', $clave);

                $users_acl = [
                    'rows' => [
                        'username' => $documento,
                        'password' => $clave,
                        'ruta' => 'umenu.json',
                        'display_name' => $json_datos['b'] . ' ' . $json_datos['c'] . ' ' . $json_datos['d'],
                        'acl_id' => 59,
                        'fec_ultimo_acceso' => $json_datos['e'],
                        'fec_ini_proceso' => '2017-04-01 00:00:00',
                        'fec_fin_proceso' => '2017-06-30 00:00:00',
                        'dias_restantes' => 'Quedan 50 d\u00edas para culminar el proceso.'
                    ]
                ];

                $this->getSessionStorage()->setAuth(true);
                $this->getSessionStorage()->save();
                $this->getSessionStorage()->add('users_acl', json_encode($users_acl));
                $this->getSessionStorage()->save();
            }
            else
            {
                $this->flashMessenger()->clearMessages();
                $this->flashmessenger()->addMessage('<div class = "alert alert-danger alert-dismissable"><button type = "button" class = "close" data-dismiss = "alert" aria-hidden = "true">x</button><b>Alerta!</b> Usuario y/o contraseña incorrecta.</div>');
                $this->getSessionStorage()->add('user', '');
                $this->getSessionStorage()->setAuth(false);
                $this->getSessionStorage()->save();
            }

            if ($this->getSessionStorage()->isAuthenticate())
            {
                return $this->redirect()->toRoute('dashboard');
            }
            else
            {
                return $this->redirect()->toRoute('usuario/sec');
            }
        }
        else
        {
            return $this->redirect()->toRoute('usuario/sec');
        }
    }

    public function logoutAction()
    {
        $config = $this->getConfig();
        $this->destroySession();
        unset($_SESSION[$config['session']['name']]);
        unset($_COOKIE['PHPSESSID']);
        $_SESSION = [];
        session_destroy();

        $this->getSessionStorage()->logout();
        return $this->redirect()->toRoute('usuario/sec');
    }

}
