<?php

namespace App\Mixins;

use Symfony\Component\HttpFoundation\Response;

/**
 * ResponseMixin
 * Register this mixin in the AppServiceProvider::boot() -> Response::mixin(new ResponseMixin());
 * @description Mixin for formatting api responses
 * @example $this->apiError($data, $message, $http_code)
 * @example $this->apiSuccess($data, $message, $http_code)
 * @example $this->apiException($exception)
 * @return Illuminate\Http\JsonResponse
 */
class ResponseMixin
{

    /**
     * Formats the error response for the api
     * @see config/messageBag.php for default responses
     * @param mixed $data
     * @param string $message
     * @param int $http_code
     * @return Illuminate\Http\JsonResponse
     */
    public function apiError()
    {
        return function ($data = [], string $message = "", int $http_code = null) {
            if (!$http_code) {
                $http_code = config('messageBag.default_error.http_code');
            }
            return response()->json([
                'message' => filled($message) ? $message : config('messageBag.default_error.message'),
                'status'  => $http_code,
                'success'   => false,
                'error'     => true,
                'data'    => is_array($data) && empty($data) ? (object) $data : $data,
            ], $http_code);
        };
    }

    /**
     * Formats the success response for the api
     * @see config/messageBag.php for default responses
     * @param mixed $data
     * @param string $message
     * @param int $http_code
     * @return Illuminate\Http\JsonResponse
     */
    public function apiSuccess()
    {
        return function ($data = [], $message = '', $http_code = null) {
            if (!$http_code) {
                $http_code = config('messageBag.default_success.http_code');
            }
            return response()->json([
                'message' => filled($message) ? $message : config('messageBag.default_success.message'),
                'status'  => $http_code,
                'success'   => true,
                'error'     => false,
                'data'    => is_array($data) && empty($data) ? (object) $data : $data,
            ], $http_code);
        };
    }

    /**
     * Formats any exceptions for the api response
     * @see config/messageBag.php for default responses
     * @param Exception $exception
     * @return Illuminate\Http\JsonResponse
     */
    public function apiException()
    {
        return function ($exception) {
            $http_code = (method_exists($exception, 'getCode') && isset(Response::$statusTexts[$exception->getCode()])) ? $exception->getCode() : config('messageBag.default_exception.http_code');
            return response()->json([
                'message' => config('messageBag.default_exception.message'),
                'status'  => $http_code,
                'success'   => false,
                'error'     => true,
                'data'    => (object)[
                    'trace' => [
                        $exception->getMessage(),
                        $exception->getLine(),
                        $exception->getFile(),
                    ]
                ]
            ], $http_code);
        };
    }
}
