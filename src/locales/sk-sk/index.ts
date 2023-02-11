import { skSK_account } from "./account";
import { skSK_avatorDropMenu } from "./user/avatorDropMenu";
import { skSK_tagsViewDropMenu } from "./user/tagsViewDropMenu";
import { skSK_title } from "./user/title";
import { skSK_globalTips } from "./global/tips";
import { skSK_permissionRole } from "./permission/role";
import { skSK_dashboard } from "./dashboard";
import { skSK_guide } from "./guide";
import { skSK_project } from "./project";
import { skSK_menu } from "./menu";
import { sk_SK_documentation } from "./documentation";

const sk_SK = {
  ...skSK_account,
  ...skSK_avatorDropMenu,
  ...skSK_tagsViewDropMenu,
  ...skSK_title,
  ...skSK_globalTips,
  ...skSK_permissionRole,
  ...skSK_dashboard,
  ...skSK_guide,
  ...skSK_menu,
  ...skSK_project,
  ...sk_SK_documentation,
};

export default sk_SK;
