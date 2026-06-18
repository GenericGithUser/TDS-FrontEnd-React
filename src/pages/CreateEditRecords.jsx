import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'
import { GetRecords } from '../hooks/GetRecords'
import '../styles/loading.css'
import toast from 'react-hot-toast'

function CreateEditRecord() {
    const { navData, clearRouteData, setRouteData } = useNavigationData();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createRecord, updateRecord } = GetRecords();

    const [title, setTitle]       = useState('');
    const [description, setDescription] = useState('');
    const [checklist, setChecklist]   = useState('');
    const [retPeriod, setRetPeriod]   = useState('');
    const [code, setCode]         = useState('');
    const [remark, setRemarks]    = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const branchCode = user.branch_code;
    const isEdit     = navData?.mode === 'edit';

    // FIXED: ALL useEffects before any early returns
    // Pre-populate for edit mode
    useEffect(() => {
        if (navData?.mode === 'edit' && navData?.data) {
            setTitle(navData.data.records_title   ?? '');
            setCode(navData.data.rec_code         ?? '');
            setDescription(navData.data.rec_description ?? '');
            setRetPeriod(navData.data.retention_period  ?? '');
            setRemarks(navData.data.remarks       ?? '');
            setChecklist(
                navData.checklistData
                    ?.map(i => i.checklist_item)
                    .join(',') ?? ''
            );
        }
    }, [navData?.mode, navData?.data?.record_id]); // re-run if record changes

    // Pre-populate code prefix for create mode
    useEffect(() => {
        if (navData?.mode === 'create') {
            setCode(branchCode);
        }
    }, [navData?.mode, branchCode]);

    // FIXED: early return AFTER all hooks
    if (!navData) return <h1>No NavData</h1>;

    const pageTitle = `${isEdit ? 'Edit' : 'Create'} Record`;

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSave = async (e) => {
        e.preventDefault(); // FIXED: prevent form reload

        if (branchCode === code.trim() || branchCode.length >= code.trim().length) {
            toast.error('Code must have values after the branch prefix!');
            return;
        }
        if (code.trim().length < 14){
            toast.error("Code must have 10 characters!");
            return;
        }

        try {
            setIsSaving(true);
            const recordData     = {
                records_title:    title,
                rec_description:  description,
                rec_code:         code,
                retention_period: retPeriod,
                remarks:          remark
            };
            const checklistItems = checklist.split(',').map(i => i.trim()).filter(Boolean);

            const result = await createRecord(recordData, checklistItems); // FIXED: await
            if (!result?.success) {
                toast.error(result?.error || 'Failed to create record');
                return;
            }

            toast.success('Record created successfully!');
            clearRouteData();
            navigate(navData.returnTo);
        } catch (err) {
            toast.error(err.message || 'Failed to create record');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // FIXED: prevent form reload

        try {
            setIsSaving(true);

            const recordData = {
                records_title:    title,
                rec_description:  description,
                rec_code:         code,
                retention_period: retPeriod,
                remarks:          remark,
            };

            const origItems  = navData?.checklistData?.map(i => i.checklist_item) ?? [];
            const availItems = checklist.split(',').map(i => i.trim()).filter(Boolean);

            const removedItems = origItems.filter(item => !availItems.includes(item));
            const addedItems   = availItems.filter(item => !origItems.includes(item));

            const updatedChecklist = navData.checklistData
                .filter(item => !removedItems.includes(item.checklist_item));

            addedItems.forEach(item => {
                updatedChecklist.push({
                    chk_record_id: navData.checklistData[0]?.chk_record_id,
                    checklist_id:  null,
                    checklist_item: item
                });
            });

            const result = await updateRecord(navData.recordId, recordData, updatedChecklist); // FIXED: await
            if (!result?.success) {
                toast.error(result?.error || 'Failed to update record');
                return;
            }

            toast.success('Record updated successfully!');

            if (navData.fromTransEdit) {
                setRouteData({
                    mode:     'edit',
                    data:     navData.data,
                    transId:  navData.trans_id,
                    returnTo: '/dashboard/home',
                });
            } else {
                clearRouteData();
            }

            navigate(navData.returnTo);
        } catch (err) {
            toast.error(err.message || 'Failed to update record');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if (navData.fromTransEdit) {
            setRouteData({
                mode:     'edit',
                data:     navData.data,
                transId:  navData.trans_id,
                returnTo: '/dashboard/home',
            });
        } else {
            clearRouteData();
        }
        navigate(navData.returnTo);
    };

    // ── Shared form fields ────────────────────────────────────────────────────
    const formFields = (
        <>
            <div className="r1">
                <div className="item">
                    <label htmlFor="recTitle" className="recLabel">Title:</label>
                    <input
                        type="text"
                        id="recTitle"
                        className="recInput"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="item">
                    <label htmlFor="recCode" className="recLabel">Code:</label>
                    <input
                        type="text"
                        id="recCode"
                        className="recInput"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={`${branchCode}0000000000`}
                        required
                    />
                </div>
            </div>

            <div className="r1">
                <div className="item itmSpecial">
                    <div className="item">
                        <label htmlFor="recDesc" className="recLabel">Description:</label>
                        <textarea
                            id="recDesc"
                            className="recInput special"
                            maxLength="300"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="recChkItems" className="recLabel">
                            Checklist Items:
                            <p className="subtext">Use Comma(,) to delimit</p>
                        </label>
                        <input
                            type="text"
                            id="recChkItems"
                            className="recInput"
                            value={checklist}
                            onChange={(e) => setChecklist(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="item itmSpecial">
                    <div className="item">
                        <label htmlFor="recRetPeriod" className="recLabel">Retention Period:</label>
                        <input
                            type="text"
                            id="recRetPeriod"
                            className="recInput"
                            value={retPeriod}
                            onChange={(e) => setRetPeriod(e.target.value)}
                            required
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="recRemarks" className="recLabel">Remarks:</label>
                        <input
                            type="text"
                            id="recRemarks"
                            className="recInput"
                            value={remark}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </>
    );

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <h1 className="ceTitle">
                {isEdit ? 'Edit' : 'Create'} Record
            </h1>

            <div className="fade-in createBox">
                {/* FIXED: one form, handler chosen by isEdit */}
                <form onSubmit={isEdit ? handleUpdate : handleSave} className="fade-in">
                    {formFields}

                    <div className="buttonCont">
                        <input
                            type="submit"
                            value={
                                isSaving
                                    ? 'Saving...'
                                    : isEdit ? 'SAVE EDITS' : 'CREATE NEW RECORD'
                            }
                            className="btnGreen"
                            disabled={isSaving}
                        />
                        <button
                            className="btnCancel"
                            type="button"
                            onClick={handleCancel}
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateEditRecord;
