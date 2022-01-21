import { UserLogin } from 'src/users/users.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bycript from 'bcryptjs';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserLogin> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return UserLogin;
  }

  /**
   * Called before post insertion.
   */
  async beforeInsert(event: InsertEvent<UserLogin>) {
    const salt = bycript.genSaltSync(12);
    event.entity.password = await bycript.hash(event.entity.password, salt);
    event.entity.hash = salt;
  }

  /**
   * Called before updating.
   **/
  async beforeUpdate(event: UpdateEvent<UserLogin>) {
    const salt = bycript.genSaltSync(12);
    event.entity.password = await bycript.hash(event.entity.password, salt);
    event.entity.hash = salt;
  }
}
