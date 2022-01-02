package backend


import static DateUtils.getStandardEuropeanFormat
import static DateUtils.parseFormattedDate
import static org.apache.commons.lang3.time.DateUtils.addDays
import static org.springframework.http.HttpStatus.NOT_FOUND

class AppointmentController extends ApplicationRestfulController<Appointment> {
    static responseFormats = ['json', 'xml']

    def exportService;

    AppointmentController() {
        super(Appointment);
    }


    /**
     * list all appointments and all their associated data based on user input from- and to Dates
     * @param fromDate
     * @param toDate
     * @return
     */
    def getAllAppointmentsAndPatientsByDates(String fromDate, String toDate) {
        Date from = parseFormattedDate(fromDate);
        Date to = parseFormattedDate(toDate);
        to = addDays(to, 1);
        List<Appointment> appointments = Appointment.where {
            appointmentDate >= from
            appointmentDate < to
        }.list()
        respond appointments
    }

    /**
     * generate and format the appointments' download export data
     */
    def downloadExport(String appointments) {
        if ((!params.exportFormat && params.exportFormat == "html") || !params.appointments) {
            render(status: NOT_FOUND.value())
        } else {
            response.contentType = grailsApplication.config.grails.mime.types[params.exportFormat]
            response.setHeader("Content-disposition", "attachment; filename=Appointments.${params.extension}")
            List fields = ["appointmentDate", "appointmentTime", "doctor", "patient"]
            Map labels = ["appointmentDate": "Appointment Date", "appointmentTime": "Appointment Time", "doctor": "Doctor", "patient": "Patient"]

            // Format fields
            def getName = { Appointment appointment, Object val ->
                return [val.firstName?.capitalize(), val.lastName?.capitalize()].findAll().join(', ');
            }
            def formatDate = { Appointment appointment, Date date ->
                return getStandardEuropeanFormat().format(date);
            }

            List<Appointment> filteredAppointments = Appointment.getAll(params.appointments.tokenize(','));

            Map formatters = [doctor: getName, appointmentDate: formatDate, patient: getName]
            Map parameters = ["column.widths": [0.3, 0.3, 0.5, 0.5]]

            exportService.export(params.exportFormat, response.outputStream, filteredAppointments, fields, labels, formatters, parameters)
        }
    }
}
