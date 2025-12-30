<?php

namespace App\Domains\Item\Entities;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['nome', 'fechamento'];
}
