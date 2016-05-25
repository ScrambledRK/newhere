<?php

use Illuminate\Database\Seeder;

use App\Language;

class LanguageTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
                ['language' => 'de', 'default_language' => true, 'published' => false, 'enabled' => true],
                ['language' => 'en', 'default_language' => false, 'published' => false, 'enabled' => true],
                ['language' => 'aa', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ab', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'af', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'am', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ar', 'default_language' => false, 'published' => false, 'enabled' => true],
                ['language' => 'as', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ay', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'az', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ba', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'be', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'bg', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'bh', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'bi', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'bn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'bo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'br', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ca', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'co', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'cs', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'cy', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'da', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'dz', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'el', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'eo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'es', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'et', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'eu', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'fa', 'default_language' => false, 'published' => false, 'enabled' => true],
                ['language' => 'fi', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'fj', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'fo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'fr', 'default_language' => false, 'published' => false, 'enabled' => true],
                ['language' => 'fy', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ga', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'gd', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'gl', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'gn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'gu', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ha', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'hi', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'hr', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'hu', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'hy', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ia', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ie', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ik', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'in', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'is', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'it', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'iw', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ja', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ji', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'jw', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ka', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'kk', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'kl', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'km', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'kn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ko', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ks', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ku', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ky', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'la', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ln', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'lo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'lt', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'lv', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mg', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mi', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mk', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ml', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mr', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ms', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'mt', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'my', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'na', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ne', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'nl', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'no', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'oc', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'om', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'pa', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'pl', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ps', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'pt', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'qu', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'rm', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'rn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ro', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ru', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'rw', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sa', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sd', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sg', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sh', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'si', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sk', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sl', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sm', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'so', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sq', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sr', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ss', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'st', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'su', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sv', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'sw', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ta', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'te', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tg', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'th', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ti', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tk', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tl', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tn', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'to', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tr', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ts', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tt', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'tw', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'uk', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'ur', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'uz', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'vi', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'vo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'wo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'xh', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'yo', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'zh', 'default_language' => false, 'published' => false, 'enabled' => false],
                ['language' => 'zu', 'default_language' => false, 'published' => false, 'enabled' => false],
            ];

          Language::insert($data);

    }
}
