<?php

namespace App\Enums;

use InvalidArgumentException;
use ReflectionClass;

enum RoleName: string
{
    case ADMIN     ='admin';
    const SURVIVOR = 'survivor';
    const CASE_WORKER = 'caseworker';
    const LAW_ENFORCEMENT = 'enforcement';
    const SYSTEM = 'system';

    public static function make(string $value): RoleName
    {
        $reflector = new ReflectionClass(self::class);
        $constants = $reflector->getConstants();

        $value = strtoupper($value); // Convert to uppercase for case-insensitive matching

        if (!in_array($value, $constants)) {
            throw new InvalidArgumentException("Invalid role name: {$value}");
        }

        return new static($value);
    }
}
