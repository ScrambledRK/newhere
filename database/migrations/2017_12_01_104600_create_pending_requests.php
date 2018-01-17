<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/*

create table pending_requests
(
	id serial not null
		constraint pending_requests_pkey
			primary key,
	user_id integer not null,
	ngo_id integer,
	role_id integer not null,
	type integer,
	created_at timestamp,
	updated_at timestamp
)
;

create unique index pending_requests_id_uindex
	on pending_requests (id)
;


 */
class CreatePendingRequests extends Migration
{
    const TABLE = 'pending_requests';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::TABLE, function (Blueprint $table)
        {
            $table->increments('id');

            $table->integer('user_id')->unsigned()->index();
            $table->integer('ngo_id')->unsigned()->nullable()->index();
            $table->integer('role_id')->unsigned()->index();
            $table->integer('type')->unsigned();
            $table->timestamps();

            $table->unique(['ngo_id', 'user_id', 'role_id']);

            $table->foreign('user_id', sprintf('%1$s_user_id_foreign', self::TABLE))
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('ngo_id', sprintf('%1$s_ngo_id_foreign', self::TABLE))
                  ->references('id')
                  ->on('ngos')
                  ->onDelete('cascade');

            $table->foreign('role_id', sprintf('%1$s_role_id_foreign', self::TABLE))
                  ->references('id')
                  ->on('roles')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop(self::TABLE);
    }
}
