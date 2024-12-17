import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Artwork } from "../types/artwork";
import { fetchArtworks } from "../services/artworkService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [rows] = useState<number>(25);
  const toast = React.useRef<Toast>(null);
  const op = React.useRef<OverlayPanel>(null);
  const [selectCount, setSelectCount] = useState<number>(1);
  const maxPages = 5;
  const [globalSelectedRows, setGlobalSelectedRows] = useState<{
    [key: number]: Artwork;
  }>({});
  const [selectionMode, setSelectionMode] = useState<"current" | "across">(
    "current"
  );
  const [remainingSelections, setRemainingSelections] = useState<number>(0);

  const loadArtworks = async (page: number) => {
    if (page > maxPages) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Maximum page limit reached (5 pages)",
        life: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetchArtworks(page);

      const transformedData = response.data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));

      setArtworks(transformedData);

      const totalPages = Math.min(
        response.data.pagination.total_pages,
        maxPages
      );
      setTotalRecords(totalPages * rows);
    } catch (error) {
      console.error("Error loading artworks:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load artworks",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onPage = (event: any) => {
    const page = event.first / event.rows + 1;
    setFirst(event.first);
    loadArtworks(page);
  };

  useEffect(() => {
    loadArtworks(1);
  }, []);

  const selectRows = () => {
    const totalAvailableRows = maxPages * rows;
    const selectedCount = Object.keys(globalSelectedRows).length;

    if (selectCount + selectedCount > totalAvailableRows) {
      toast.current?.show({
        severity: "error",
        summary: "Selection Error",
        detail: `Maximum selection limit is ${totalAvailableRows} rows. Currently selected: ${selectedCount}`,
        life: 3000,
      });
      return;
    }

    if (selectionMode === "current") {
      if (selectCount > artworks.length) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Selection count exceeds available rows on current page",
          life: 3000,
        });
        return;
      }
      const newSelection = artworks.slice(0, selectCount);
      const newGlobalSelected = { ...globalSelectedRows };
      newSelection.forEach((artwork) => {
        newGlobalSelected[artwork.id] = artwork;
      });
      setGlobalSelectedRows(newGlobalSelected);
    } else {
      setRemainingSelections(selectCount);
      toast.current?.show({
        severity: "info",
        summary: "Multi-page Selection",
        detail: `Please select ${selectCount} rows. You cannot select more than this number.`,
        life: 3000,
      });
    }
    op.current?.hide();
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const totalSelected = Object.keys(globalSelectedRows).length;
    const newSelections = e.value.filter(
        artwork => !Object.keys(globalSelectedRows).includes(artwork.id.toString())
    );
    
    // Check if trying to select more than allowed
    if (totalSelected + newSelections.length > selectCount) {
        toast.current?.show({
            severity: "error",
            summary: "Selection Limit Reached",
            detail: `You can only select ${selectCount} rows in total. Currently selected: ${totalSelected}`,
            life: 3000,
        });
        return;
    }

    if (selectionMode === "across" && remainingSelections > 0) {
        if (newSelections.length > remainingSelections) {
            toast.current?.show({
                severity: "error",
                summary: "Selection Limit Reached",
                detail: `You can only select ${remainingSelections} more rows to reach your limit of ${selectCount}`,
                life: 3000,
            });
            return;
        }

        const newGlobalSelected = { ...globalSelectedRows };
        newSelections.forEach(artwork => {
            newGlobalSelected[artwork.id] = artwork;
        });
        setGlobalSelectedRows(newGlobalSelected);
        setSelectedArtworks([...Object.values(newGlobalSelected)]);
        setRemainingSelections(prev => prev - newSelections.length);
    } else {
        // Current page mode
        const newGlobalSelected = { ...globalSelectedRows };
        e.value.forEach(artwork => {
            newGlobalSelected[artwork.id] = artwork;
        });
        artworks.forEach(artwork => {
            if (!e.value.find(selected => selected.id === artwork.id)) {
                delete newGlobalSelected[artwork.id];
            }
        });
        setGlobalSelectedRows(newGlobalSelected);
        setSelectedArtworks(e.value);
    }
  };

  useEffect(() => {
    const currentPageSelections = artworks.filter((artwork) =>
      Object.keys(globalSelectedRows).includes(artwork.id.toString())
    );
    setSelectedArtworks(currentPageSelections);
  }, [artworks, globalSelectedRows]);

  return (
    <div>
      <Toast ref={toast} />
      <div className="mb-3 flex gap-2">
        <Button
          type="button"
          label="Select Rows"
          icon="pi pi-check-square"
          onClick={(e) => op.current?.toggle(e)}
        />

        {Object.keys(globalSelectedRows).length > 0 && (
          <Button
            type="button"
            label={`Clear Selection (${
              Object.keys(globalSelectedRows).length
            })`}
            icon="pi pi-times"
            severity="secondary"
            onClick={() => {
              setGlobalSelectedRows({});
              setSelectedArtworks([]);
              setRemainingSelections(0);
              setSelectionMode("current");
            }}
          />
        )}

        <OverlayPanel ref={op}>
          <div className="p-3">
            <h5>Select Number of Rows</h5>
            <InputNumber
              value={selectCount}
              onValueChange={(e) => setSelectCount(e.value || 1)}
              min={1}
              max={rows * maxPages}
              showButtons
            />
            <div className="mt-2">
              <label className="block mb-2">Selection Mode</label>
              <div className="flex gap-2">
                <Button
                  label="Current Page"
                  severity={selectionMode === "current" ? "info" : "secondary"}
                  onClick={() => setSelectionMode("current")}
                />
                <Button
                  label="Across Pages"
                  severity={selectionMode === "across" ? "info" : "secondary"}
                  onClick={() => setSelectionMode("across")}
                />
              </div>
            </div>
            <Button
              label="Apply"
              icon="pi pi-check"
              className="mt-2"
              onClick={selectRows}
            />
          </div>
        </OverlayPanel>
      </div>

      <DataTable
        value={artworks}
        selection={selectedArtworks}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        paginator
        rows={rows}
        totalRecords={totalRecords}
        lazy
        first={first}
        onPage={onPage}
        loading={loading}
        selectionMode="multiple"
        className="p-datatable-striped"
        emptyMessage="No artworks found"
        showGridlines
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="title" header="Title" sortable />
        <Column field="place_of_origin" header="Place of Origin" sortable />
        <Column field="artist_display" header="Artist" sortable />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" sortable />
        <Column field="date_end" header="End Date" sortable />
      </DataTable>
    </div>
  );
};

export default ArtworkTable;
