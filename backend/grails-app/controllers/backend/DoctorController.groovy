package backend

import grails.rest.RestfulController

class DoctorController extends RestfulController {
    static responseFormats = ['json', 'xml']

    DoctorController() {
        super(Doctor);
    }
}