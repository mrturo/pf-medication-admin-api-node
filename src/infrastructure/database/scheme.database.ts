export class Scheme {
  public static readonly PF_ACTIVATED_FUSER = {
    name: 'PF_ACTIVATED_FUSER',
    columns: {
      FTUS_ID: 'FTUS_ID',
      USER_ID: 'USER_ID',
      FTUS_HOLDER: 'FTUS_HOLDER',
      FTUS_PUBLIC: 'FTUS_PUBLIC',
      FTUS_SECRET: 'FTUS_SECRET'
    }
  };
  public static readonly PF_ACTIVATED_FLINK = {
    name: 'PF_ACTIVATED_FLINK',
    columns: {
      FTLK_ID: 'FTLK_ID',
      USER_ID: 'USER_ID',
      FTLK_INSTITUTION: 'FTLK_INSTITUTION',
      FTLK_LINK: 'FTLK_LINK',
      FTLK_TOKEN: 'FTLK_TOKEN'
    }
  };
  public static readonly PF_TESTING_1 = {
    name: 'PF_TESTING_1',
    columns: {
      TEST_ID: 'TEST_ID',
      TEST_CREATED: 'TEST_CREATED',
      TEST_UPDATED: 'TEST_UPDATED',
      TEST_ACTIVATED: 'TEST_ACTIVATED',
      TEST_TEXT: 'TEST_TEXT',
      TEST_NUMB: 'TEST_NUMB'
    }
  };
  public static readonly PF_TESTING_2 = {
    name: 'PF_TESTING_2',
    columns: {
      TEST_ID: 'TEST_ID',
      TEST_CREATED: 'TEST_CREATED',
      TEST_UPDATED: 'TEST_UPDATED',
      TEST_ACTIVATED: 'TEST_ACTIVATED',
      TEST_TEXT: 'TEST_TEXT',
      TEST_NUMB: 'TEST_NUMB'
    }
  };
  public static readonly ALL = [
    Scheme.PF_ACTIVATED_FUSER,
    Scheme.PF_ACTIVATED_FLINK,
    Scheme.PF_TESTING_1,
    Scheme.PF_TESTING_2
  ];
}
