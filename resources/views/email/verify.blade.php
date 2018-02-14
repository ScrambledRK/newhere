@extends('beautymail::templates.sunny')

@section('content')

    @include ('beautymail::templates.sunny.heading' , [
        'heading' => 'Welcome to NewHere!',
        'level' => 'h1',
    ])

    @include ('beautymail::templates.sunny.heading' , [
        'heading' => 'Thank you for your registration!',
        'level' => 'h2',
    ])
    @include('beautymail::templates.sunny.contentStart')

        <p>Ein neuer User wurde für diese E-Mail registriert. Um den Account zu aktivieren, klicke auf den Link unten und melde dich an.</p>

        <p>We have just received n user registration for this email. To activate this account click the button below and login.</p>

    @include('beautymail::templates.sunny.contentEnd')

    @include('beautymail::templates.sunny.button', [
            'title' => 'Confirm my account',
            'link' => url('/api/auth/confirmation/'.$confirmation_code),
            'color' => '#357DBA'
    ])


@stop

@section('footer')
<p>Nähere Informationen und Rückfragen unter:<br>
E-Mail: <a href="mailto:info@newhere.at">info@newhere.at</a></p>
<p>
© 2016 New Here
</p>
@stop
