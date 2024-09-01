import { defineStore } from 'pinia'

export const useDepositStore = defineStore('deposit', {
  state: () => ({
    depositAmount: 0
  }),
  actions: {
    setDepositAmount(amount) {
      this.depositAmount = amount
    }
  }
})