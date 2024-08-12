import { useState } from 'react';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { TranslationContext } from '../../translation/translation.context';
import CurrentUser from '../../user/client/user.service.client';
import ProfileForm from './profileForm';

import './style/profile.client.scss';
import { ProfileApi } from './profile.api.client';

(async () => {
  const translation = await Translations.load('profile', 'common', 'error');

  redirectToAuth(CurrentUser);

  const user = await ProfileApi.getUser();

  return RenderClientPage(() => {
    const [userData, setUserData] = useState(user);
    const [isSending, setIsSending] = useState<boolean>(false);

    return (
      <TranslationContext.Provider value={translation}>
        <section className={`profile-container --small ${isSending ? '--sending' : ''}`}>
          <h1 className="profile__title">{translation.get('profile.title')}</h1>
          <a className="btn --light profile__see-profile-btn" href={translation.link(`${CurrentUser.link}/about`)}>
            {translation.get('profile.seeMyProfilePage')}
          </a>
          <ProfileForm userData={userData} setUserData={setUserData} setIsSending={setIsSending} />
        </section>
      </TranslationContext.Provider>
    );
  });
})();
