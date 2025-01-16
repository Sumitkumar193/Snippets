<?php

/**
 * Class AutoDateParser
 * @description This class is used to parse date strings in various formats
 * @use AutoDateParser::parse($input)
 * @return DateTime|false
 */
class AutoDateParser
{
    public static function parse($input)
    {
        $effective_date = false;

        $date_formats = array(
            'd-m-Y', 'd/m/Y', 'Y/m/d', 'Y-m-d', 'd-M-Y', 'd-M-y', 'd/M/y', 'd/M/Y',
            'm-d-Y', 'm/d/Y'
        );

        foreach ($date_formats as $format) {
            $parse = DateTime::createFromFormat($format, $input);
            if ($parse && $parse->format($format) == $input) {
                $effective_date = $parse;
                break;
            }
        }
        return $effective_date;
    }
}
