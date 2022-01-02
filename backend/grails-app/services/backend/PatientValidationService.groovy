package backend

class PatientValidationService {

    /**
     * validates if a patient is deleteable by checking if patient is already assigned to an appointment
     * @param patient
     * @return
     */
    boolean validateDelete(Patient patient) {
        return  !(Appointment.where {
            patient == patient
        }.asBoolean())
    }
}
