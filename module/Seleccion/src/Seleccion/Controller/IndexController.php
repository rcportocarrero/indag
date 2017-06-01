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

    public function getSeleccionTable() {
        if (!$this->_seleccionTable) {
            $sm = $this->getServiceLocator();
            $this->_seleccionTable = $sm->get('Seleccion\Model\SeleccionTable');
        }
        return $this->_seleccionTable;
    }

    public function instrumentosAction() {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function instrumentosdetAction() {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function inicioAction() {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function reportesAction() {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(TRUE);
        return $viewModel;
    }

    public function getInstrumentosAction() {
        Util::Session()->id_instrumento = '';
        $params = [
        ];
        $result = $this->curl_('instrument/list', $params, false);

        $resultados = [];
        if (intval($result['code']) === 200) {
            $json_response = json_decode($result['data'], true);

            if (count($json_response) > 0) {
                foreach ($json_response as $lista) {
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
                    foreach ($lista['q'] as $lista) {
                        $cantidad_instrumentos++;
                        if ((Boolean) $lista['b'] !== false) {
                            $num_sincronizado++;
                        }
                    }

                    $rpta['n'] = $num_sincronizado . '/' . $cantidad_instrumentos;
                    $rpta['m'] = 20;
                    $rpta['i'] = 'Docentes';
                    array_push($resultados, $rpta);
                }
            }
        }

        return new JsonModel($resultados);
    }

    public function setInstrumentosAction() {

        $request = $this->getRequest();
        $id = $request->getPost('id_instrumento', '');
        Util::Session()->id_instrumento = $id;
        $respuesta = [
            'sucess' => 200,
        ];
        return new JsonModel($respuesta);
    }

    public function pruebaAction() {
        $result_dre = $this->curl_('loginsuccess', [], false);
            if (intval($result_dre['code']) === 200) {
                $json_dre = json_decode($result_dre['data'], true);                
                echo $result_dre['data'];
        }
        exit;
    }

    public function getInstrumentosDetailAction() {
        $params = [
            'id_instrumento' => Util::Session()->id_instrumento
        ];
        $result = $this->curl_('instrumentemployee/list', $params, true);

        if (intval($result['code']) === 200) {
            $resultados = [];

            Util::Session()->listado_dre_ugel = [];
            Util::Session()->dre_ = [];
            Util::Session()->ugel_x_dre = [];

            $result_dre = $this->curl_('dre/list', $params, true);
            if (intval($result_dre['code']) === 200) {
                $json_dre = json_decode($result_dre['data'], true);
                Util::Session()->listado_dre_ugel = $json_dre;
                $listado_dre = Util::Session()->listado_dre_ugel;
                $arr_dre = [];
                foreach ($listado_dre as $dre) {
                    $data = [
                        'id' => $dre['a'],
                        'desc' => $dre['c']
                    ];
                    array_push($arr_dre, $data);
                    $ar_ugel_x_dre[$dre['a']] = [];
                    foreach ($dre['g'] as $ugel) {
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
            if (count($json_response) > 0) {
                foreach ($json_response as $listaInstrumentos) {
                    $i = 0;
                    foreach ($listaInstrumentos['j'] as $lista) {
                        $i++;
                    }
                    $rpta = [
                        'id_instrumento' => $listaInstrumentos['d'],
                        'id_instrumento_empleado' => $listaInstrumentos['a'],
                        'a' => $listaInstrumentos['a'],
                        'informante' => $listaInstrumentos['i']['k']['c'] . ' ' . $listaInstrumentos['i']['k']['d'] . ' ' . $listaInstrumentos['i']['k']['e'],
                        'estado' => '0/' . $i,
                        'id_dre' => $listaInstrumentos['i']['g']['a'],
                        'cod_dre' => $listaInstrumentos['i']['g']['b'],
                        'id_ugel' => $listaInstrumentos['i']['h']['a'],
                        'cod_ugel' => $listaInstrumentos['i']['h']['b'],
                        'institucion_educativa' => $listaInstrumentos['i']['i']['c']
                    ];
                    array_push($resultados, $rpta);
                }
            }
            $respuesta = [
                'empleados' => $resultados,
                'lista_dre' => Util::Session()->dre_,
            ];
        } else {
            $respuesta = [];
        }
        return new JsonModel($respuesta);
    }

    public function getUgelDreAction() {
        $request = $this->params();
        $id =  $request->fromQuery('id', '');
        $ugel_x_dre = Util::Session()->ugel_x_dre[$id];

        return new JsonModel($ugel_x_dre);
    }

    public function getPreguntasAction() {
        $request = $this->params();
        $id = Util::Session()->id_instrumento;
        $id_emp =  $request->fromQuery('id_instrumento_emp', '');

        $params = [
            'id_instrumento' => $id,
            'id_instrumento_empleado' => $id_emp,
        ];
        $result = $this->curl_('instrumentemployee/questions', $params,true);
        $json_response = json_decode($result['data'], true);

        return new JsonModel($json_response);
    }

    public function preguntasAction() {
        $view = new ViewModel();
        $view->setTerminal(TRUE);
        return $view;
    }

    

}
