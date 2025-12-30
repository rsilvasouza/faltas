<?php

namespace App\Domains\Lista\Entities;

use App\Domains\Grupo\Entities\Grupo;
use App\Domains\Produto\Entities\Produto;
use Illuminate\Database\Eloquent\Model;

class ListaItem extends Model
{
    protected $fillable = ['lista_id', 'produto_id', 'grupo_id', 'quantidade', 'preco_atual', 'comprado'];

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_id');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }
}
