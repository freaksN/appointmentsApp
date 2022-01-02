package backend

import grails.converters.JSON
import grails.gorm.transactions.Transactional
import grails.rest.RestfulController
import grails.web.http.HttpHeaders

import static org.springframework.http.HttpStatus.*

class PatientController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def exportService;
    def patientValidationService;

    PatientController() {
        super(Patient);
    }

    /**
     * validates and deletes a patient
     * @return
     */
    @Transactional
    def delete() {
        Patient patient = Patient.get(params.id);
        boolean isDeleteValid = patientValidationService.validateDelete(patient);
        if (isDeleteValid) {
            super.delete();
            return
        }
        render(status: PRECONDITION_FAILED.value(), message: "Patient already assigned to an appointment")
    }


    /**
     * generate and format the patients' download export data
     */
    def downloadExport = {
        if ((!params.exportFormat && params.exportFormat == "html") || !params.patients) {
            render(status: NOT_FOUND.value())
        } else {
            response.contentType = grailsApplication.config.grails.mime.types[params.exportFormat]
            response.setHeader("Content-disposition", "attachment; filename=Patients.${params.extension}")
            List fields = ["firstName", "lastName", "notes"]
            Map labels = ["firstName": "First Name", "lastName": "Last Name", "notes": "Notes"]

            // Format fields
            def capitalizeNames = { Patient patient, String value ->
                return value?.capitalize();
            }

            List<Patient> filteredPatients = Patient.getAll(params.patients.tokenize(','));

            Map formatters = [firstName: capitalizeNames, lastName: capitalizeNames]
            Map parameters = ["column.widths": [0.3, 0.3, 0.5]]

            exportService.export(params.exportFormat, response.outputStream, filteredPatients, fields, labels, formatters, parameters)
        }
    }

    /**
     * overrides default save behavior since we handle errors in a different way
     */
    @Transactional
    def save() {
        if (handleReadOnly()) {
            return
        }
        def instance = createResource()

        instance.validate()
        if (instance.hasErrors()) {
            transactionStatus.setRollbackOnly()
            response.setStatus(UNPROCESSABLE_ENTITY.value())
            render instance.errors as JSON;
            return
        }

        saveResource instance

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [classMessageArg, instance.id])
                redirect instance
            }
            '*' {
                response.addHeader(HttpHeaders.LOCATION,
                        grailsLinkGenerator.link(resource: this.controllerName, action: 'show', id: instance.id, absolute: true,
                                namespace: hasProperty('namespace') ? this.namespace : null))
                respond instance, [status: CREATED, view: 'show']
            }
        }
    }

}
