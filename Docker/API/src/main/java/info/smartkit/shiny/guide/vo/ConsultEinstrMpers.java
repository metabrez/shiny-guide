package info.smartkit.shiny.guide.vo;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by smartkit on 03/07/2017.
 */
@Entity
public class ConsultEinstrMpers {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private long id;


        public ConsultEinstrMpers() {
        }

        public long getEiid() {
                return eiid;
        }

        public void setEiid(long eiid) {
                this.eiid = eiid;
        }

        public long getMpid() {
                return mpid;
        }

        public void setMpid(long mpid) {
                this.mpid = mpid;
        }

        public String getEiname() {
                return einame;
        }

        public void setEiname(String einame) {
                this.einame = einame;
        }

        public String getEicontent() {
                return eicontent;
        }

        public void setEicontent(String eicontent) {
                this.eicontent = eicontent;
        }

        public String getMpname() {
                return mpname;
        }

        public void setMpname(String mpname) {
                this.mpname = mpname;
        }

        public String getMpcontent() {
                return mpcontent;
        }

        public void setMpcontent(String mpcontent) {
                this.mpcontent = mpcontent;
        }

        private long eiid;
        private long mpid;
        private String einame;
        private String eicontent;
        private String mpname;
        private String mpcontent;

        @Transient
        public double getRgbS() {
                return rgbS;
        }

        public void setRgbS(double rgbS) {
                this.rgbS = rgbS;
        }
        @Transient
        public double getHsvS() {
                return hsvS;
        }

        @Override public String toString() {
                return "ConsultEinstrMpers{" + "id=" + id + ", eiid=" + eiid + ", mpid=" + mpid + ", einame='" + einame + '\'' + ", eicontent='" + eicontent + '\'' + ", mpname='" + mpname + '\'' + ", mpcontent='" + mpcontent + '\'' + ", rgbS=" + rgbS
                        + ", hsvS=" + hsvS + ", labS=" + labS + ", targets=" + targets.toString() + '}';
        }

        public void setHsvS(double hsvS) {
                this.hsvS = hsvS;
        }
        private double rgbS=0.00;//similarity of colorRgb.
        private double hsvS=0.00;//similarity of colorHsv.
        @Transient
        public double getLabS() {
                return labS;
        }

        public void setLabS(double labS) {
                this.labS = labS;
        }

        private double labS=0.00;//similarity of colorLab.

        @Transient
        private List<UserInfo> targets = new ArrayList<>();

        public List<UserInfo> getTargets() {
                return targets;
        }

        public void setTargets(List<UserInfo> targets) {
                this.targets = targets;
        }
}
