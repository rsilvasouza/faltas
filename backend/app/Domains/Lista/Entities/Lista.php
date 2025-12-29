<?php

namespace App\Domains\Lista\Entities;

use Illuminate\Database\Eloquent\Model;

class Lista extends Model
{
    protected $fillable = ['nome', 'fechamento'];
}
