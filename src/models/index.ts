import MusicEvent from './MusicEvent';
import Statistic from './Statistic';
import sequelize from '../config/database';

//Inizializza le associazioni se necessario
//Per ora, i modelli sono indipendenti

const models = {
     MusicEvent,
     Statistic,
     sequelize,
};
export default models;

