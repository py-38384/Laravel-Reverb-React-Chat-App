<?php

    return [
        'paths' => ['api/*', 'sanctum/csrf-cookie'],
        'allowed_origins' => ['http://localhost:3000'], // your React frontend
        'allowed_methods' => ['*'],
        'allowed_headers' => ['*'],
        'supports_credentials' => true,
    ];