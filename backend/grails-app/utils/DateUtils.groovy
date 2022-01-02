import java.text.SimpleDateFormat

class DateUtils {

    /**
     * adjusts the format based on the european standard
     * HINT: this should be adjusted if the App is going to be used outside of Europe!!!
     * @return
     */
    static SimpleDateFormat getStandardEuropeanFormat() {
        return new SimpleDateFormat("dd.MM.yyyy");
    }

    /**
     * parses the string date using the standard european date format
     * @param date
     * @return
     */
    static Date parseFormattedDate(String date) {
        return getStandardEuropeanFormat().parse(date);
    }

    /**
     * parses the string date using the standard european date format
     * @param date
     * @return
     */
    static String formatDate(Date date) {
        return getStandardEuropeanFormat().format(date);
    }
}
