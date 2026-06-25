const mongoose = require("mongoose");

const entregaSchema = new mongoose.Schema({
  voluntario: {
    type: String,
    required: true
  },

  familiaDestino: {
    type: String,
    required: true
  },

  alimentoEntregue: {
    type: String,
    required: true
  },

  quantidade: {
    type: Number,
    required: true,
    min: 1
  },

  dataEntrega: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Entrega", entregaSchema);