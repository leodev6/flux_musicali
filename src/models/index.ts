import { EventoMusicale} from "./EventoMusicale";
import { Statistica } from "./Statistica";
import sequelize from "../config/database";

const modelli = {
     EventoMusicale,
     Statistica,
     sequelize,
};

export default modelli;