import { genSaltSync, hash } from 'bcryptjs';
import { UserLogin } from 'src/users/users.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

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
    const salt = genSaltSync(12);
    event.entity.password = await hash(event.entity.password, salt);
  }

  /**
   * Called before updating.
   **/
  async beforeUpdate(event: UpdateEvent<UserLogin>) {
    const salt = genSaltSync(12);
    event.entity.password = await hash(event.entity.password, salt);
    event.entity.hash = salt;
  }
}
