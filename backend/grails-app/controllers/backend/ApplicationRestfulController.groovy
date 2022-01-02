package backend;

import grails.converters.JSON;
import grails.gorm.transactions.Transactional;
import grails.rest.RestfulController;
import grails.web.http.HttpHeaders;

import static org.springframework.http.HttpStatus.*;

class ApplicationRestfulController<T> extends RestfulController<T> {

    ApplicationRestfulController(Class<T> resource) {
        super(resource);
    }

    /**
     * overrides default save behavior since we handle errors in a different way
     */
    @Transactional
    def save() {
        if (handleReadOnly()) {
            return
        }
        T instance = createResource()

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

    /**
     * overrides default save behavior since we handle errors in a different way
     */
    @Transactional
    def update() {
        if (handleReadOnly()) {
            return
        }

        T instance = queryForResource(params.id)
        if (instance == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        instance.properties = getObjectToBind()

        instance.validate()
        if (instance.hasErrors()) {
            transactionStatus.setRollbackOnly()
            response.setStatus(UNPROCESSABLE_ENTITY.value())
            render instance.errors as JSON;
            return
        }

        updateResource instance
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [classMessageArg, instance.id])
                redirect instance
            }
            '*' {
                response.addHeader(HttpHeaders.LOCATION,
                        grailsLinkGenerator.link(resource: this.controllerName, action: 'show', id: instance.id, absolute: true,
                        namespace: hasProperty('namespace') ? this.namespace : null))
                respond instance, [status: OK]
            }
        }
    }

}
