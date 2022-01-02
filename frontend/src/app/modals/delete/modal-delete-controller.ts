declare const angular;


export const modalControllerModule = angular.module('modalControllerModule', [])
  .controller('DeleteModalController', ModalDeleteController);

export default modalControllerModule.name;

ModalDeleteController.$inject = [];

function ModalDeleteController() {
  let vm = this;
}
