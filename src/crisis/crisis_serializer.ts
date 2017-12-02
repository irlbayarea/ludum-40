import { serialize, deserialize } from 'serializer.ts/Serializer';
import Crisis from './crisis';

export default class CrisisSerializer {
  public static serialize(crisis: Crisis): string {
    return serialize(JSON.stringify(crisis));
  }

  public static unserialize(json: string): Crisis {
    return deserialize<Crisis>(Crisis, JSON.parse(json));
  }

  public static unserializeAll(json: string): Crisis[] {
    return deserialize<Crisis[]>(Crisis, JSON.parse(json));
  }
}
