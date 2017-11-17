<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OfferTranslation extends Model
{

    protected $fillable = ['title', 'description', 'opening_hours'];

    /**
     * Update the model without touching the 'updated_at' timestamp.
     *
     * @param  array  $attributes
     * @return $this
     */
    public function updateUntouched(array $attributes)
    {
        try {
            $timestamps = $this->timestamps;
            $this->timestamps = false;

            return tap($this)->update($attributes);
        } finally {
            $this->timestamps = $timestamps;
        }
    }

}
