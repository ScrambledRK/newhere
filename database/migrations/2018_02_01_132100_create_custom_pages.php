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
class CreateCustomPages extends Migration
{


    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("pages", function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('slug');
            $table->boolean('enabled')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['slug']);
        });

        //
        Schema::create("page_translations", function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('page_id');

            $table->string('title')->nullable();
            $table->longText('content')->nullable();

            $table->integer('version')->default(1);
            $table->string('locale')->index();
            $table->timestamps();

            $table->unique(['page_id', 'locale']);

            $table->foreign('page_id', sprintf('%1$s_page_id_foreign', "page_translations"))
                  ->references('id')
                  ->on('pages')
                  ->onDelete('cascade');
        });

        //
        Schema::table('categories', function (Blueprint $table)
        {
            $table->integer('page_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("page_translations", function (Blueprint $table)
        {
            $table->dropForeign(sprintf('%1$s_page_id_foreign', "page_translations"));
        });

        Schema::drop("pages");
        Schema::drop("page_translations");

        Schema::table('categories', function (Blueprint $table)
        {
            $table->dropColumn('page_id');
        });
    }
}
