package backend

import grails.validation.Validateable

import static DateUtils.formatDate

class Appointment implements Validateable {
    Long id;
    Date appointmentDate;
    String appointmentTime;
    Doctor doctor;
    Patient patient;

    static mapping = {
        sort appointmentDate: 'desc';
    }

    static constraints = {
        appointmentTime nullable: false, matches: "^\\d{2}:\\d{2}"
        appointmentDate nullable: false, matches: "^\\d{2}.\\d{2}.\\d{4}", unique: ['appointmentTime', 'doctor', 'patient']
        doctor nullable: false
        patient nullable: false
    }

    def getDoctorInfo() {
        return ['id': doctor.id, 'firstName': doctor.firstName, 'lastName': doctor.lastName]
    }

    def formatAppointmentDate(Date date) {
        return formatDate(date);
    }
}
