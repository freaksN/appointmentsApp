package backend

import static DateUtils.formatDate

class Patient {
    Long id;
    String firstName;
    String lastName;
    String notes;

    static mapping = {
        notes type: 'text'
    }

    static constraints = {
        notes nullable: true
    }


    List<Appointment> getPatientsAppointments(String id) {
        def patientId = id != null ? id : this.id
        return Appointment.where {
            patient.id == patientId
        }.list();
    }


    def getPatientData(String id) {
        return getPatientsAppointments(id).collect {
            [
                    'id'             : it.id,
                    'appointmentDate': formatAppointmentDate(it.appointmentDate),
                    'appointmentTime': it.appointmentTime,
                    'doctor'         : it.doctor.properties.subMap(['id', 'firstName', 'lastName'])
            ]
        }
    }

    def formatAppointmentDate(Date date) {
        return formatDate(date);
    }
}
