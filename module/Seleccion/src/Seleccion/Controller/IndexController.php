<?php

namespace Seleccion\Controller;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use ZfcItp\Controller\BaseController;
use Zend\Crypt\Password\Bcrypt;
use Zend\File\Transfer\Adapter\Http;
use Zend\Mail\Message;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\SmtpOptions;
use Zend\Mime\Mime;
use Zend\Mime\Part as MimePart;
use Zend\Mime\Message as MimeMessage;
use Zend\Validator\ValidatorChain;
use Zend\Validator\StringLength;
use Zend\Validator\Regex;
use GuzzleHttp\Client;
use BaseX\Util\Util;

/*
 * Description of IndexController
 *
 * @author hnkr
 */

class IndexController extends \BaseX\Controller\BaseController {

    protected $needAuthentication = TRUE;
    protected $enable_layout = false;
    protected $_seleccionTable = null;

    public function getSeleccionTable()
    {
        if (!$this->_seleccionTable)
        {
            $sm = $this->getServiceLocator();
            $this->_seleccionTable = $sm->get('Seleccion\Model\SeleccionTable');
        }
        return $this->_seleccionTable;
    }

    public function instrumentosAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function instrumentosdetAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function inicioAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function reportesAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function getInstrumentosAction()
    {
        Util::Session()->id_instrumento = '';
        $params = [
        ];
        $username = $this->getSessionStorage()->get('user');
        $password = $this->getSessionStorage()->get('pass');

        $result = $this->curl_('instrument/list', $params, false, ['user' => $username, 'pass' => $password]);

        $resultados = [];
        if (intval($result['code']) === 200)
        {
            $json_response = json_decode($result['data'], true);

            if (count($json_response) > 0)
            {
                foreach ($json_response as $lista)
                {
                    $rpta = [];
                    $rpta = [
                        'a' => $lista['a'],
                        'b' => $lista['b'],
                        'f' => $lista['f'],
                        'g' => $lista['g'],
                        'h' => $lista['h'],
                        'i' => $lista['i'],
                        'j' => $lista['j'],
                    ];
                    $num_sincronizado = 0;
                    $cantidad_instrumentos = 0;
                    foreach ($lista['q'] as $lista)
                    {
                        $cantidad_instrumentos++;
                        if ((Boolean) $lista['b'] !== false)
                        {
                            $num_sincronizado++;
                        }
                    }

                    $rpta['n'] = $num_sincronizado . '/' . $cantidad_instrumentos;
                    $rpta['m'] = 20;
                    $rpta['i'] = 'Docentes';
                    $rpta['t'] = '$cantidad_instrumentos';
                    array_push($resultados, $rpta);
                }
            }
        }

        return new JsonModel($resultados);
    }

    public function setInstrumentosAction()
    {

        $request = $this->getRequest();
        $id = $request->getPost('id_instrumento', '');
        Util::Session()->id_instrumento = $id;
        $respuesta = [
            'sucess' => 200,
        ];
        return new JsonModel($respuesta);
    }

    public function saveFrmFnAction()
    {
        $request = $this->getRequest();
        if ($request->isPost())
        {
            $id = $request->getPost('a', '');
            $id_empleado = base64_decode($id);
            $params = [
                'id_instrumento_empleado' => $id_empleado
            ];

            $username = $this->getSessionStorage()->get('user');
            $password = $this->getSessionStorage()->get('pass');
            $result = $this->curl_('question/close', $params, true, ['user' => $username, 'pass' => $password]);

            if (intval($result['code']) === 200)
            {
                $rpta_json = json_decode($result['data'], true);
                if ($rpta_json['success'])
                {
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
                    'msg' => 'Por favor, volver a intentarlo en unos minutos.',
                ];
            }
        }
        else
        {
            $respuesta = [
                'id' => -100,
                'msg' => 'Método aceptado : POST',
            ];
        }


        return new JsonModel($respuesta);
    }

    public function saveFrmAction()
    {

        $request = $this->getRequest();
        if ($request->isPost())
        {
            $id = $request->getPost('a', '');
            if ($this->is_base64_encoded($id))
            {
                $username = $this->getSessionStorage()->get('user');
                $password = $this->getSessionStorage()->get('pass');

                $result = $this->curl_2('question/save', base64_decode($id), ['user' => $username, 'pass' => $password]);
                $resultados = [];
                if (intval($result['code']) === 200)
                {
                    $rpta_json = json_decode($result['data'], true);
                    if ($rpta_json['success'])
                    {
                        $respuesta = [
                            'id' => 200,
                            'msg' => 'Guardado correctamente.',
                            'rest' => intval($rpta_json['message'])
                        ];
                    }
                    else
                    {
                        $respuesta = [
                            'id' => -100,
                            'msg' => 'Error al guardar.',
                        ];
                    }
                }
            }
            else
            {
                $respuesta = [
                    'id' => -100,
                    'msg' => 'Formato erróneo.',
                ];
            }
        }
        else
        {
            $respuesta = [
                'id' => -100,
                'msg' => 'Método aceptado : POST',
            ];
        }


        return new JsonModel($respuesta);
    }

    public function is_base64_encoded($data)
    {
        if (preg_match('%^[a-zA-Z0-9/+]*={0,2}$%', $data))
        {
            return TRUE;
        }
        else
        {
            return FALSE;
        }
    }
    
    public function pruebaAction(){
               $params = [
            'id_instrumento' => Util::Session()->id_instrumento
        ];
        $username = $this->getSessionStorage()->get('user');
        $password = $this->getSessionStorage()->get('pass');

        $result = $this->curl_('instrumentemployee/list', $params, true, ['user' => $username, 'pass' => $password]);
        var_dump($result);
        exit;
    }
    public function getInstrumentosDetailAction()
    {
        $params = [
            'id_instrumento' => Util::Session()->id_instrumento
        ];
        $username = $this->getSessionStorage()->get('user');
        $password = $this->getSessionStorage()->get('pass');

        $result = $this->curl_('instrumentemployee/list', $params, true, ['user' => $username, 'pass' => $password]);

        if (intval($result['code']) === 200)
        {
            $resultados = [];

            Util::Session()->listado_dre_ugel = [];
            Util::Session()->dre_ = [];
            Util::Session()->ugel_x_dre = [];

            $result_dre = $this->curl_('dre/list', $params, true);
            if (intval($result_dre['code']) === 200)
            {
                $json_dre = json_decode($result_dre['data'], true);
                Util::Session()->listado_dre_ugel = $json_dre;
                $listado_dre = Util::Session()->listado_dre_ugel;
                $arr_dre = [];
                foreach ($listado_dre as $dre)
                {
                    $data = [
                        'id' => $dre['a'],
                        'desc' => $dre['c']
                    ];
                    array_push($arr_dre, $data);
                    $ar_ugel_x_dre[$dre['a']] = [];
                    foreach ($dre['g'] as $ugel)
                    {
                        $ar_ugel = [
                            'id' => $ugel['a'],
                            'desc' => $ugel['c']
                        ];
                        array_push($ar_ugel_x_dre[$dre['a']], $ar_ugel);
                    }
                }
                Util::Session()->dre_ = $arr_dre;
                Util::Session()->ugel_x_dre = $ar_ugel_x_dre;
            }

            $json_response = json_decode($result['data'], true);
            $resultados = [];
            if (count($json_response) > 0)
            {
                foreach ($json_response as $listaInstrumentos)
                {
                    $rpta = [
                        'id_instrumento' => $listaInstrumentos['d'],
                        'id_instrumento_empleado' => $listaInstrumentos['a'],
                        'a' => $listaInstrumentos['a'],
                        'informante' => $listaInstrumentos['i']['k']['c'] . ' ' . $listaInstrumentos['i']['k']['d'] . ' ' . $listaInstrumentos['i']['k']['e'],
                        'estado' => $listaInstrumentos['l'] . '/' . $listaInstrumentos['k'],
                        'id_dre' => $listaInstrumentos['i']['g']['a'],
                        'cod_dre' => $listaInstrumentos['i']['g']['b'],
                        'id_ugel' => $listaInstrumentos['i']['h']['a'],
                        'cod_ugel' => $listaInstrumentos['i']['h']['b'],
                        'institucion_educativa' => $listaInstrumentos['i']['i']['c'],
                        'total' => $listaInstrumentos['k']
                    ];
                    array_push($resultados, $rpta);
                }
            }
            $respuesta = [
                'empleados' => $resultados,
                'lista_dre' => Util::Session()->dre_,
            ];
        }
        else
        {
            $respuesta = [];
        }
        return new JsonModel($respuesta);
    }

    public function getUgelDreAction()
    {
        $request = $this->params();
        $id = $request->fromQuery('id', '');
        $ugel_x_dre = Util::Session()->ugel_x_dre[$id];

        return new JsonModel($ugel_x_dre);
    }

    public function getPreguntasFrecuentesAction()
    {
        $params = [
        ];
        $username = $this->getSessionStorage()->get('user');
        $password = $this->getSessionStorage()->get('pass');

        $result = $this->curl_('versionapp/getcurrent', $params, false, ['user' => $username, 'pass' => $password]);
        $json_response = json_decode($result['data'], true);
        return new JsonModel($json_response);
    }

    public function getPreguntasAction()
    {
        $request = $this->params();
        $id = Util::Session()->id_instrumento;
        $id_emp = $request->fromQuery('id_instrumento_emp', '');

        $params = [
            'id_instrumento' => $id,
            'id_instrumento_empleado' => $id_emp,
        ];
        $username = $this->getSessionStorage()->get('user');
        $password = $this->getSessionStorage()->get('pass');
        $result = $this->curl_('instrumentemployee/questions', $params, true, ['user' => $username, 'pass' => $password]);
        $json_response = json_decode($result['data'], true);

        return new JsonModel($json_response);
    }

    public function preguntasAction()
    {
        $view = new ViewModel();
        $view->setTerminal(TRUE);
        return $view;
    }

}
