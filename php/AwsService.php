<?php

namespace App\Services;

use Illuminate\Http\Request;
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class AwsService
{
    protected $client;

    public function __construct()
    {
        $config = [
            'version' => 'latest',
            'region' => config('filesystems.disks.s3.region'),
            'credentials' => [
                'key' => config('filesystems.disks.s3.key'),
                'secret' => config('filesystems.disks.s3.secret'),
            ],
            'signature_version' => 'v4',
        ];
        $this->client = new S3Client($config);
    }

    /**
     * @method get_pre_post_signed_url()
     * @description Get pre signed url for upload file to s3 bucket
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_pre_post_signed_url(Request $request)
    {
        $bucket = config('filesystems.disks.s3.bucket');
        $formInputs = ['acl' => 'public-read'];
        $expires = '+5 minutes';
        $fileKeys = $request->input('fileKeys');
        $urls = [];
        try {
            foreach($fileKeys as $file => $length) {
                $name = strtolower(pathinfo($file, PATHINFO_FILENAME));
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                $file_name = preg_replace('/[^A-Za-z0-9\-]/', '_', $name) . '-' . uniqid() . '.' . $extension;

                $options = [
                    ['acl' => 'public-read'],
                    ['bucket' => $bucket],
                    ['starts-with', '$key', "offline-works/$file_name"],
                ];
                $postObject = new \Aws\S3\PostObjectV4(
                    $this->client,
                    $bucket,
                    $formInputs,
                    $options,
                    $expires
                );
    
                $formAttributes = $postObject->getFormAttributes();
                $formInputs = $postObject->getFormInputs();

                $urls[$file] = [
                    'formAttribute' => $formAttributes,
                    'formInputs' => $formInputs,
                    'file_name' => $file_name,
                ];
            }

            $response = [
                'status' => 'success',
                'data' => $urls,
            ];

            return response()->json($response, 200);
        } catch (AwsException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }

    }

    /**
     * Get signed url for download file from s3 bucket
     */
    public function get_pre_signed_url(Request $request)
    {
        $bucket = config('filesystems.disks.s3.bucket');
        $key = $request->input('key');
        $expires = '+5 minutes';
        try {
            $command = $this->client->getCommand('GetObject', [
                'Bucket' => $bucket,
                'Key' => $key
            ]);
            $request = $this->client->createPresignedRequest($command, $expires);
            $presignedUrl = (string) $request->getUri();
            return response()->json([
                'status' => 'success',
                'data' => $presignedUrl,
            ], 200);
        } catch (AwsException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get signed url to read directory from s3 bucket
     */
    public function get_pre_signed_url_direct(Request $request)
    {
        $bucket = config('filesystems.disks.s3.bucket');
        $prefix = $request->input('prefix') ?? 'avatars';
        $expires = '+5 minutes';
        try {
            $command = $this->client->getCommand('ListObjects', [
                'Bucket' => $bucket,
                'Prefix' => $prefix
            ]);
            $request = $this->client->createPresignedRequest($command, $expires);
            $presignedUrl = (string) $request->getUri();
            dd($presignedUrl);
            return response()->json([
                'status' => 'success',
                'data' => $presignedUrl,
            ], 200);
        } catch (AwsException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get folder list from s3 bucket signed url
     */

    public function get_folder_list(Request $request)
    {
        $bucket = config('filesystems.disks.s3.bucket');
        $prefix = $request->input('prefix');
        $delimiter = '/';
        $expires = '+5 minutes';
        try {
            $request = $this->client->getCommand('ListObjects', [
                'Bucket' => $bucket,
                'Delimiter' => $delimiter,
                'Prefix' => $prefix
            ]);

            $url = $this->client->createPresignedRequest($request, $expires);

            $presignedUrl = (string) $url->getUri();
            
            return response()->json([
                'status' => 'success',
                'data' => $presignedUrl,
            ], 200);
        } catch (AwsException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}