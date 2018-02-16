<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/*

create table pages
(
	id serial(10) default nextval('pages_id_seq'::regclass) not null
		constraint pages_id_pk
			primary key,
	slug varchar(255) not null,
	enabled bool(1) default false not null,
	created_at timestamp(29,6),
	updated_at timestamp(29,6),
	deleted_at timestamp(29,6)
)
;

create unique index pages_slug_uindex
	on pages (slug)
;



 */
class CreateProviderNotes extends Migration
{


    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("ngo_notes", function (Blueprint $table)
        {
            $table->increments('id');
            $table->boolean('checked')->default(false);
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        //
        Schema::table('ngos', function (Blueprint $table)
        {
            $table->integer('note_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("ngo_notes");

        Schema::table('ngos', function (Blueprint $table)
        {
            $table->dropColumn('note_id');
        });
    }
}
