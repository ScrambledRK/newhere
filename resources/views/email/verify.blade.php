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

        <p> Bitte folge den unteren Link ('confirm my account') um deine
Registrierung zu bestätigen. Dein Account wird daraufhin aktiviert und du
kannst dich anschließend anmelden, einen Anbieter erstellen und Angebote
hinzufügen oder Übersetzer werden.</p>

        <p>Please follow the link below to confirm your registration.
    Your account will then be activated and you will be able to log in, begin
adding your provider and offers to the platform, or register as a translator.</p>

    @include('beautymail::templates.sunny.contentEnd')

    @include('beautymail::templates.sunny.button', [
            'title' => 'Confirm my account',
            'link' => url('/api/auth/confirmation/'.$confirmation_code),
            'color' => '#357DBA'
    ])


@stop

@section('footer')
<p>Nähere Informationen und Rückfragen unter:<br>
E-Mail: <a href="mailto:info@newhere.org">info@newhere.org</a></p>
<p>
© 2016 New Here
</p>
@stop
